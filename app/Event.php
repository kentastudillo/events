<?php
namespace App;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $fillable = ['name', 'start_date', 'end_date', 'days'];

    protected $casts = [
        'days' => 'array',
    ];
}